import React from 'react';

// Define types for criteria, groups, and the overall filter
interface Criterion {
  field: string;
  operator: string;
  value: string;
}

interface ConditionGroup {
  groupId: string;
  groupOperator: 'AND' | 'OR';
  criteria: Criterion[];
}

interface Filter {
  conditions: ConditionGroup[];
  logicalOperator: 'AND' | 'OR';
}

// Map raw operators to human-readable phrases
const operatorMap: Record<string, string> = {
  Equals: 'equals',
  before: 'is before',
  after: 'is after',
  // extend as needed
};

// Format values: dates become "Month D, YYYY", others stay quoted
function formatValue(value: string): string {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(value)) {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return `"${value}"`;
}

// Build a single group's statement, wrapped in parentheses
function buildGroupStatement(group: ConditionGroup): string {
  const parts = group.criteria.map(c =>
    `${c.field} ${operatorMap[c.operator] || c.operator} ${formatValue(c.value)}`
  );
  return `(${parts.join(` ${group.groupOperator} `)})`;
}

// React component to render the full filter statement
export const FilterStatement: React.FC<{
    conditions: ConditionGroup[];
    logicalOperator: 'AND' | 'OR';
  }> = ({ conditions, logicalOperator }) => {
    const statement = conditions
      .map(buildGroupStatement)
      .join(` ${logicalOperator} `);
    return <div>{statement}</div>;
  };
// export const FilterStatement: React.FC<{ filter: Filter }> = ({ filter }) => {
//   const statement = filter.conditions
//     .map(buildGroupStatement)
//     .join(` ${filter.logicalOperator} `);
//   return <div>{statement}</div>;
// };

// Example usage:
// const data: Filter = {
//   conditions: [ ... ],
//   logicalOperator: 'OR'
// };
// <FilterStatement filter={data} />
