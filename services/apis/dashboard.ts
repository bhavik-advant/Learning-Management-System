export const getDashBoardData = async () => {
  try {
    const res = await fetch(`/api/mentor/dashboard`);

    const result = await res.json();

    console.log(result);

    if (!result.success || result.statusCode != 200) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('DashBaord Data fetching done:', error);
    throw error;
  }
};
