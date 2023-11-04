export default class DataHelper {
  static nonce() {
    return (
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue() +
      DataHelper.randomValue()
    );
  }

  static randomValue() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  static localTimeConv(value) {
    return new Date(value + 'Z');
  }
}
