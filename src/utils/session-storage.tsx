function setSessionStorageWithExpiry(key: string, value: string, durationInMs: number) {
  const now = new Date().getTime();
  const item = {
    value: value,
    expiry: now + durationInMs, // Current time + duration
  };
  sessionStorage.setItem(key, JSON.stringify(item));
}

function getSessionStorageWithExpiry(key: string) {
  const itemStr = sessionStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();

  if (now > item.expiry) {
    sessionStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export { setSessionStorageWithExpiry, getSessionStorageWithExpiry }