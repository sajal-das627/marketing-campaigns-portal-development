// FilterHelpers.ts
import { Filter, ConditionGroup } from '../types/filter';  // wherever you keep your interfaces

const operatorMap: Record<string,string> = {
  Equals: 'equals',
  before: 'is before',
  after: 'is after',
  // …etc
};

function formatValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value)
      .toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  }
  return `"${value}"`;
}

function buildGroupStatement(group: ConditionGroup): string {
  return '(' +
    group.criteria
      .map(c => `${c.field} ${operatorMap[c.operator]||c.operator} ${formatValue(c.value)}`)
      .join(` ${group.groupOperator} `)
    + ')';
}

export function generateStatement(
  filters: Filter[],
  logicalOperator: 'AND'|'OR'
): string {
  return filters
    .map(filter =>
      (filter.conditions as ConditionGroup[])
        .map(buildGroupStatement)
        .join(` ${filter.logicalOperator} `)
    )
    .join(` ${logicalOperator} `);
}



/////////////////1st code
// export interface Condition {
//   field: string;
//   operator: string;
//   value: string;
// }

// export interface Group {
//   groupId: string;
//   groupOperator: 'AND' | 'OR';
//   conditions: Condition[];
// }

// export interface GroupsData {
//   groups: Group[];
// }

// /**
//  * Utility function to check if a value is a valid date.
//  */
// const isValidDate = (dateStr: string): boolean => {
//   return !isNaN(Date.parse(dateStr));
// };

// /**
//  * Maps a condition to its string representation.
//  */
// const formatCondition = (condition: Condition): string => {
//   const value =
//     isNaN(Number(condition.value)) && !isValidDate(condition.value)
//       ? `'${condition.value}'`
//       : condition.value;
//   return `${condition.field} ${condition.operator} ${value}`;
// };

// /**
//  * Generates a statement string from the groups data.
//  */
// export const generateStatement = (groups: Group[]): string => {
//   const groupStatements = groups.map((group) => {
//     const conditionsStr = group.conditions
//       .map((condition) => formatCondition(condition))
//       .join(` ${group.groupOperator} `);

//     return `(${conditionsStr})`;
//   });

//   return groupStatements.join(' AND ');
// };
