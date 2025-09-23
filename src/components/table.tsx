import React, { type JSX } from "react";
import { Box, Text } from "ink";

type Scalar = string | number | boolean | null | undefined;

type ScalarDict = {
  [key: string]: Scalar;
};

export type CellProps = React.PropsWithChildren<{ column: number }>;

export type TableProps<T extends ScalarDict> = {
  /**
   * List of values (rows).
   */
  data: T[];
  /**
   * Columns that we should display in the table.
   */
  columns: (keyof T)[];
  /**
   * Cell padding.
   */
  padding: number;
  /**
   * Header component.
   */
  header: (props: React.PropsWithChildren<{}>) => JSX.Element;
  /**
   * Component used to render a cell in the table.
   */
  cell: (props: CellProps) => JSX.Element;
  /**
   * Component used to render the skeleton of the table.
   */
  skeleton: (props: React.PropsWithChildren<{}>) => JSX.Element;
};

export default class Table<T extends ScalarDict> extends React.Component<
  Pick<TableProps<T>, "data"> & Partial<TableProps<T>>
> {
  getConfig(): TableProps<T> {
    return {
      data: this.props.data,
      columns: this.props.columns || this.getDataKeys(),
      padding: this.props.padding || 1,
      header: this.props.header || Header,
      cell: this.props.cell || Cell,
      skeleton: this.props.skeleton || Skeleton,
    };
  }

  getDataKeys(): (keyof T)[] {
    let keys = new Set<keyof T>();

    for (const data of this.props.data) {
      for (const key in data) {
        keys.add(key);
      }
    }

    return Array.from(keys);
  }

  getColumns(): Column<T>[] {
    const { columns, padding } = this.getConfig();

    const widths: Column<T>[] = columns.map((key) => {
      const header = String(key).length;
      const data = this.props.data.map((data) => {
        const value = data[key];

        if (value == undefined || value == null) return 0;
        return String(value).length;
      });

      const width = Math.max(...data, header) + padding * 2;

      return {
        column: key,
        width: width,
        key: String(key),
      };
    });

    return widths;
  }

  getHeadings(): Partial<T> {
    const { columns } = this.getConfig();

    const headings: Partial<T> = columns.reduce(
      (acc, column) => ({ ...acc, [column]: column }),
      {},
    );

    return headings;
  }

  header = row<T>({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      line: "─",
      left: "┌",
      right: "┐",
      cross: "┬",
    },
  });

  heading = row<T>({
    cell: this.getConfig().header,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      line: " ",
      left: "│",
      right: "│",
      cross: "│",
    },
  });

  separator = row<T>({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      line: "─",
      left: "├",
      right: "┤",
      cross: "┼",
    },
  });

  data = row<T>({
    cell: this.getConfig().cell,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      line: " ",
      left: "│",
      right: "│",
      cross: "│",
    },
  });

  footer = row<T>({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      line: "─",
      left: "└",
      right: "┘",
      cross: "┴",
    },
  });

  render() {
    const columns = this.getColumns();
    const headings = this.getHeadings();

    return (
      <Box flexDirection="column">
        {this.header({ key: "header", columns, data: {} })}
        {this.heading({ key: "heading", columns, data: headings })}

        {this.props.data.map((row, index) => {
          const key = `row-${index}`;

          return (
            <Box flexDirection="column" key={key} width={200}>
              {this.separator({ key: `separator-${key}`, columns, data: {} })}
              {this.data({ key: `data-${key}`, columns, data: row })}
            </Box>
          );
        })}

        {this.footer({ key: "footer", columns, data: {} })}
      </Box>
    );
  }
}

type RowConfig = {
  /**
   * Component used to render cells.
   */
  cell: (props: CellProps) => JSX.Element;
  /**
   * Tells the padding of each cell.
   */
  padding: number;
  /**
   * Component used to render skeleton in the row.
   */
  skeleton: {
    component: (props: React.PropsWithChildren<{}>) => JSX.Element;
    /**
     * Characters used in skeleton.
     *    |             |
     * (left)-(line)-(cross)-(line)-(right)
     *    |             |
     */
    left: string;
    right: string;
    cross: string;
    line: string;
  };
};

type RowProps<T extends ScalarDict> = {
  key: string;
  data: Partial<T>;
  columns: Column<T>[];
};

type Column<T> = {
  key: string;
  column: keyof T;
  width: number;
};

function row<T extends ScalarDict>(config: RowConfig): (props: RowProps<T>) => JSX.Element {
  const skeleton = config.skeleton;

  return (props) => (
    <Box flexDirection="row">
      <skeleton.component>{skeleton.left}</skeleton.component>

      {...intersperse(
        (i) => {
          const key = `${props.key}-hseparator-${i}`;

          return <skeleton.component key={key}>{skeleton.cross}</skeleton.component>;
        },

        props.columns.map((column, colI) => {
          const value = props.data[column.column];

          if (value == undefined || value == null) {
            const key = `${props.key}-empty-${column.key}`;

            return (
              <config.cell key={key} column={colI}>
                {skeleton.line.repeat(column.width)}
              </config.cell>
            );
          } else {
            const key = `${props.key}-cell-${column.key}`;

            const ml = config.padding;
            const mr = column.width - String(value).length - config.padding;

            return (
              <config.cell key={key} column={colI}>
                {`${skeleton.line.repeat(ml)}${String(value)}${skeleton.line.repeat(mr)}`}
              </config.cell>
            );
          }
        }),
      )}

      <skeleton.component>{skeleton.right}</skeleton.component>
    </Box>
  );
}

export function Header(props: React.PropsWithChildren<{}>) {
  return (
    <Text bold color="blue">
      {props.children}
    </Text>
  );
}

export function Cell(props: CellProps) {
  return <Text>{props.children}</Text>;
}

export function Skeleton(props: React.PropsWithChildren<{}>) {
  return <Text bold>{props.children}</Text>;
}

function intersperse<T, I>(intersperser: (index: number) => I, elements: T[]): (T | I)[] {
  let interspersed: (T | I)[] = elements.reduce((acc, element, index) => {
    if (acc.length === 0) return [element];
    return [...acc, intersperser(index), element];
  }, [] as (T | I)[]);

  return interspersed;
}
