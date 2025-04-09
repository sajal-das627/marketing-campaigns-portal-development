

// Generate the statement
// const statement = generateStatement(conditions);
// console.log(statement);


// // Define the structure of an individual condition and a group of conditions
// interface Condition {
//   field: string;
//   operator: string;
//   value: string;
// }

// interface ConditionGroup {
//   groupId: string;
//   groupOperator: 'AND' | 'OR';
//   criteria: Condition[];
// }

// /**
// * Helper to check if a string represents a valid date.
// * (Excludes pure numeric strings to avoid treating them as dates.)
// */
// function isValidDate(value: string): boolean {
//   if (!value || value.trim() === '') {
//       return false;
//   }
//   // Exclude purely numeric values (e.g. "2024") from being considered dates
//   if (/^\d+$/.test(value.trim())) {
//       return false;
//   }
//   const date = new Date(value);
//   return !isNaN(date.getTime());
// }

// /**
// * Helper to format a single condition into a human-readable string.
// * For example: { field: "Email Opened", operator: "Equals", value: "Yes" }
// * becomes "Email Opened Equals 'Yes'".
// */
// function formatCondition(condition: Condition): string {
//   const { field, operator, value } = condition;
//   let formattedValue = value;
//   // If the value is a valid date string, format it as 'YYYY-MM-DD'
//   if (isValidDate(value)) {
//       const date = new Date(value);
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       formattedValue = `${year}-${month}-${day}`;
//   }
//   // Determine if the value is numeric (for number values, no quotes needed)
//   const isNumeric = value.trim() !== '' && !isNaN(Number(value));
//   if (isNumeric) {
//       return `${field} ${operator} ${formattedValue}`;
//   } else {
//       // For string and date values, wrap in quotes
//       return `${field} ${operator} '${formattedValue}'`;
//   }
// }

// /**
// * Generate a readable statement from an array of condition groups.
// * Each group's criteria are joined by the group's operator, and groups are wrapped
// * in parentheses and joined by their leading operator in sequence.
// */
// export function generateStatement(conditionGroups: ConditionGroup[]): string {
//   let statement = '';
//   conditionGroups.forEach((group, index) => {
//       if (!group.criteria || group.criteria.length === 0) {
//           return; // skip empty groups if any
//       }
//       // Format all conditions in the group and join them with the group's operator
//       const combinedCriteria = group.criteria
//           .map(c => formatCondition(c))
//           .join(` ${group.groupOperator} `);
//       // If multiple criteria in the group, wrap them in parentheses
//       const groupClause = group.criteria.length > 1
//           ? `(${combinedCriteria})`
//           : combinedCriteria;
//       // Append this group's clause to the statement
//       if (index === 0) {
//           // first group: just add the clause
//           statement = groupClause;
//       } else {
//           // subsequent groups: prepend the group's operator (AND/OR)
//           statement += ` ${group.groupOperator} ${groupClause}`;
//       }
//   });
//   return statement;
// }


/////////////////1st code
export interface Condition {
  field: string;
  operator: string;
  value: string;
}

export interface Group {
  groupId: string;
  groupOperator: 'AND' | 'OR';
  conditions: Condition[];
}

export interface GroupsData {
  groups: Group[];
}

/**
 * Utility function to check if a value is a valid date.
 */
const isValidDate = (dateStr: string): boolean => {
  return !isNaN(Date.parse(dateStr));
};

/**
 * Maps a condition to its string representation.
 */
const formatCondition = (condition: Condition): string => {
  const value =
    isNaN(Number(condition.value)) && !isValidDate(condition.value)
      ? `'${condition.value}'`
      : condition.value;
  return `${condition.field} ${condition.operator} ${value}`;
};

/**
 * Generates a statement string from the groups data.
 */
export const generateStatement = (groups: Group[]): string => {
  const groupStatements = groups.map((group) => {
    const conditionsStr = group.conditions
      .map((condition) => formatCondition(condition))
      .join(` ${group.groupOperator} `);

    return `(${conditionsStr})`;
  });

  return groupStatements.join(' AND ');
};
