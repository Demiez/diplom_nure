const signin = async (user) => {
  try {
    let response = await fetch('/auth/signin/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    let response = await fetch('/auth/signout/', { method: 'GET' });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const auth = {
  isAuthenticated() {
    if (typeof window == 'undefined') return false;

    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'));
    else return false;
  },
  authenticate(jwt, cb) {
    if (typeof window !== 'undefined')
      sessionStorage.setItem('jwt', JSON.stringify(jwt));
    cb();
  },
  clearJWT(cb) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
    cb();
    signout().then((data) => {
      document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  },
};

export { signin, signout, auth };
