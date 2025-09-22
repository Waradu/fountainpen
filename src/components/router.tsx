import React, {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";
import { Text } from "ink";

type Path = `/${string}`;

interface RouteProps {
  path: Path;
  element?: React.ReactNode;
  children?: React.ReactNode;
}

export function Route(_: RouteProps): null {
  return null;
}

type RouterChild = React.ReactElement<RouteProps>;

interface Props {
  default?: Path;
  fallback?: RouterChild;
  children: RouterChild[] | RouterChild | React.ReactNode;
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
  const [path, setPath] = useState<Path>(defaultPath || "/");

  const navigate = (to: string) => {
    if (to.startsWith("/")) {
      setPath(to as Path);
    } else {
      const currentParts = path.slice(1).split("/");
      const toParts = to.split("/");
      const resolvedParts: string[] = [];

      resolvedParts.push(...currentParts.slice(0, -1));

      for (const part of toParts) {
        if (part === "..") {
          if (resolvedParts.length > 0) {
            resolvedParts.pop();
          }
        } else if (part !== "." && part !== "") {
          resolvedParts.push(part);
        }
      }

      setPath(`/${resolvedParts.join("/")}` as Path);
    }
  };

  if (!Array.isArray(children)) children = [children];

  if (!path) return null;

  const parts = path.slice(1).split("/");

  const routes = Children.toArray(children).filter(
    (child): child is RouterChild =>
      isValidElement(child) && child.type === Route
  );

  const current = routes.find((child) => {
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

  const currentElement = current?.props.element
    ? current?.props.element
    : current?.props.children;

  return (
    <RouterProvider.Provider
      value={{
        slugs,
        path,
        navigate,
      }}
    >
      {children}
      {currentElement ?? (fallback ? fallback : <ErrorPage />)}
    </RouterProvider.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterProvider);
  if (!context) throw new Error("'useRouter' must be used inside '<Router>'");
  return context;
}
