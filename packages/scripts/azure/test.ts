import 'zx/globals';

export const test = async (
  arg1: string,
  arg2: string,
  arg3: string,
  arg4: string,
  arg5: string,
) => {
  console.log(`arg1: ${arg1?.length ?? -1}`);
  console.log(`arg2: ${arg2?.length ?? -1}`);
  console.log(`arg3: ${arg3?.length ?? -1}`);
  console.log(`arg4: ${arg4?.length ?? -1}`);
  console.log(`arg5: ${arg5?.length ?? -1}`);
};
