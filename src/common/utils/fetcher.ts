const fetcher = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    const error = new Error(response.statusText);
    throw error;
}

export default fetcher;
