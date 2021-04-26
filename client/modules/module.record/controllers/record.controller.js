const create = async (params, credentials, record) => {
  try {
    let response = await fetch('/api/records/new/' + params.userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: record,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByUser = async (params, credentials) => {
  try {
    let response = await fetch('/api/records/by/' + params.userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listNewsFeed = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/records/feed/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const removeRecord = async (params, credentials) => {
  try {
    let response = await fetch('/api/records/' + params.recordId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const like = async (params, credentials, recordId) => {
  try {
    let response = await fetch('/api/records/like/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, recordId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const unlike = async (params, credentials, recordId) => {
  try {
    let response = await fetch('/api/records/unlike/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, recordId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const comment = async (params, credentials, recordId, comment) => {
  try {
    let response = await fetch('/api/records/comment/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        recordId,
        comment,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const uncomment = async (params, credentials, recordId, comment) => {
  try {
    let response = await fetch('/api/records/uncomment/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        recordId,
        comment,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  listNewsFeed,
  listByUser,
  create,
  removeRecord,
  like,
  unlike,
  comment,
  uncomment,
};
