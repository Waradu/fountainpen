import React, { createContext, useContext, useState } from "react";
import { Text } from "ink";
import nodePath from "path";

type Path = `/${string}`;

interface RouteProps {
  path: Path;
  element: React.ReactNode;
}

export function Route(_: RouteProps): null {
  return null;
}

type RouterChild = React.ReactElement<RouteProps>;

interface Props {
  default?: Path;
  fallback?: RouterChild;
  children: RouterChild[] | RouterChild;
}

function matchRoute(template: string[], route: string[]): boolean {
  if (route.length !== template.length) return false;

  return template.every(
    (segment, i) => segment.startsWith(":") || segment === route[i]
  );
}

interface RouteContext {
  slugs: ReadonlyMap<string, string>;
  path: Path;
  navigate: (to: string) => void;
}

function ErrorPage() {
  const { path } = useRouter();

  return <Text>'{path}' not found</Text>;
}

const RouterProvider = createContext<RouteContext | undefined>(undefined);

export function Router({ default: defaultPath, fallback, children }: Props) {
  const [path, setPath] = useState(defaultPath || "/");

  const navigate = (to: string) => {
    setPath(nodePath.resolve(path, to) as Path);
  };

  if (!Array.isArray(children)) children = [children];

  if (!path) return null;

  const parts = path.slice(1).split("/");

  const current = children.find((child) => {
    const template = child.props.path.slice(1).split("/");

    return matchRoute(template, parts);
  });

  const slugs: Map<string, string> = new Map();

  current?.props.path
    .slice(1)
    .split("/")
    .forEach((part, i) => {
      if (part != parts[i]) slugs.set(part.slice(1), parts[i]!);
    });

  return (
    <RouterProvider.Provider
      value={{
        slugs,
        path,
        navigate,
      }}
    >
      {current?.props.element ?? (fallback ? fallback : <ErrorPage />)}
    </RouterProvider.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterProvider);
  if (!context) throw new Error("'useRouter' must be used inside '<Router>'");
  return context;
}
