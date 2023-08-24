const fetch = require('node-fetch');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');

const statement = async (config = {}) => {
  const { url, statement, database, schema, role, token, proxy, wait = 300 } = config;
  const method = "POST";
  const body = {
    statement,
    database,
    schema,
    role
  };
  const headers = {
	  "Content-type": "application/json",
	  "Authorization": `Bearer ${token}`
  };
  const options = {
    method,
    headers,
    body: JSON.stringify(body)
  };
  if(proxy) {
    const httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(proxy);
    options.agent = httpsAgent;
  }

  // Run query
  const result = await fetch(url, options);
  const initialResponse = await result.json();
  console.log(initialResponse.code, initialResponse.message);
  
  let response;

  // If query is still running, retry
  if(initialResponse.code === "333334") {
    try {
      response = await getAsyncQueryResult(url, token, initialResponse.statementHandle, proxy, wait);
    } catch (error) {
      throw error;
    } 
  } else if(initialResponse.code === "390318"){
    throw new Error(initialResponse.message, {cause: "390318"})
  } else if(initialResponse.code === "390303"){
    throw new Error(initialResponse.message, {cause: "390303"})
  } else {
    response = initialResponse;
  }

  // Get metadata
  const { resultSetMetaData: { partitionInfo, rowType }, statementHandle } = response;

  // Get data from partitions
  const dataArrays = await Promise.all(
    partitionInfo.map (
      async(partition, index) => await getPartition(url, token, statementHandle, proxy, index)
    )
  );

  const data = dataArrays.flat(1);

  return {rowType, data};
  
};

async function getPartition (baseUrl, token, statementHandle, proxy, partition) {
  const headers = {
	  "Content-type": "application/json",
	  "Authorization": `Bearer ${token}`
  };
  const options = {headers};
  if(proxy) {
    const httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(proxy);
    options.agent = httpsAgent;
  }
  const url = `${baseUrl}${statementHandle}?partition=${partition}`;

  const result = await fetch(url, options);
  const response = await result.json();
  return response.data;
}

async function getAsyncQueryResult (baseUrl, token, statementHandle, proxy, wait = 300, attempts = 0) {
  attempts++;
  const headers = {
	  "Content-type": "application/json",
	  "Authorization": `Bearer ${token}`
  };
  const url = baseUrl + statementHandle;
  const options = {headers};

  if(proxy) {
    const httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(proxy);
    options.agent = httpsAgent;
  }

  const result = await fetch(url, options);
  const response = await result.json();

  if(response.code === "333334") {
    if(attempts > wait) {
      throw new Error(`Query did not complete within ${wait} seconds`);
    } else {
      console.log(`Query still running, retrying (attempt ${attempts}/${wait})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await getAsyncQueryResult(baseUrl, token, statementHandle, proxy, wait, attempts);
    }
  } else {
    return response;
  }
}

module.exports = statement;