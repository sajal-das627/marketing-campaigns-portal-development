// // useUnsavedChangesWarning.ts
// import { useEffect } from 'react';

// const useUnsavedChangesWarning = (shouldWarn: boolean) => {
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (shouldWarn) {
//         e.preventDefault();
//         e.returnValue = ''; // Standard way to trigger the prompt
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [shouldWarn]);
// };

// export default useUnsavedChangesWarning;
