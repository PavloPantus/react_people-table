const getDataFromUrl = async(url) => {
  const responsePromise = await fetch(url);
  const data = await responsePromise.json();

  return data;
};

export default getDataFromUrl;
