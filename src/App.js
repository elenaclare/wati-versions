import React, { useState, useEffect } from 'react';

const initialApis = {
  billing: [
    {
      name: 'Dev',
      url: 'https://client-wati-billing-dev-service.clare.ai/api/file/getVersion',
      version: '',
    },
    {
      name: 'Stage',
      url: 'https://client-wati-billing-stage-service.clare.ai/api/file/getVersion',
      version: '',
    },
    {
      name: 'PROD',
      url: 'https://client-wati-billing-prod-service.clare.ai/api/file/getVersion',
      version: '',
    },
  ],
  integration: [
    {
      name: 'Dev',
      url: 'https://wati-integration-service.clare.ai/api/file/getVersion',
      version: '',
    },
    {
      name: 'Stage',
      url: 'https://stage-wati-integration-service.clare.ai/api/file/getVersion',
      version: '',
    },
    {
      name: 'PROD',
      url: 'https://wati-integration-prod-service.clare.ai/api/file/getVersion',
      version: '',
    },
  ],
};

const App = () => {
  const [versionApis, setVersionApis] = useState(initialApis);

  useEffect(() => {
    fetchAll();
    setInterval(fetchAll, 5000);
  }, []);

  const fetchAll = () => {
    Object.keys(versionApis).forEach((type) => fetchByType(type));
  };

  const fetchApi = (url) => {
    return fetch(url).then((res) => res.json());
  };

  const fetchByType = (type) => {
    if (!Promise.allSettled) {
      Promise.allSettled = function (promises) {
        return Promise.all(
          promises.map((p) =>
            Promise.resolve(p).then(
              (value) => ({
                status: 'fulfilled',
                value: value,
              }),
              (error) => ({
                status: 'rejected',
                reason: error,
              })
            )
          )
        );
      };
    }
    let newVersionApis = { ...versionApis };
    Promise.allSettled(versionApis[type].map((api) => fetchApi(api.url)))
      .then((results) => {
        results.forEach((result, index) => {
          newVersionApis[type][index].version = JSON.stringify(
            result.value.result
          );
        });
        setVersionApis(newVersionApis);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ lineHeight: 2 }}>
      <h2>Billing service</h2>
      <ul>
        {versionApis?.billing?.map((item, index) => (
          <li key={`billing_${index * 1}`}>
            <b>{item.name}</b>: {item.version}
          </li>
        ))}
      </ul>
      <h2>Integration service</h2>
      <ul>
        {versionApis?.integration?.map((item, index) => (
          <li key={`integration_${index * 1}`}>
            <b>{item.name}</b>: {item.version}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
