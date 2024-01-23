import Taro from "@tarojs/taro";

// 异步写入
export const SetStorageSync = (key, data) => {
  try {
    Taro.setStorageSync(key, data);
  } catch (err) {
    return;
  }
};
// 异步读取
export const GetStorageSync = (key) => {
  try {
    return Taro.getStorageSync(key);
  } catch (err) {
    return undefined;
  }
};
// 同步写入
export const SetStorage = (key, data) => {
  return new Promise((resolve, rejects) => {
    Taro.setStorage({
      key: key,
      data: data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        rejects(err);
      });
  });
};
// 同步读取
export const GetStorage = (key) => {
  return new Promise((resolve, rejects) => {
    Taro.getStorage({
      key: key,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        rejects(err);
      });
  });
};

// 同步删除
export const RemoveStorageSync = (key) => {
  Taro.removeStorageSync(key);
};
// 异步删除
export const RemoveStorage = (key) => {
  return new Promise((resolve, rejects) => {
    Taro.removeStorage({
      key: key,
    }).then(() => {
      resolve();
    });
  });
};

// 同步清空
export const ClearStorageSync = () => {
  Taro.clearStorageSync();
};
// 异步清空
export const ClearStorage = () => {
  return new Promise((resolve, rejects) => {
    Taro.clearStorage().then(() => {
      resolve();
    });
  });
};
