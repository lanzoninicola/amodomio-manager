export default function sort(arr: any[], field: string, order: string = "asc") {
  if (order === "asc") {
    const sorted = arr.sort((a, b) => {
      if ((a[field] || 0) > (b[field] || 0)) {
        return 1;
      }
      if ((a[field] || 0) < (b[field] || 0)) {
        return -1;
      }
      return 0;
    });

    return sorted;
  }

  if (order === "desc") {
    const sorted = arr.sort((a, b) => {
      if ((a[field] || 0) < (b[field] || 0)) {
        return -1;
      }
      if ((a[field] || 0) > (b[field] || 0)) {
        return 1;
      }
      return 0;
    });

    return sorted;
  }

  return arr;
}
