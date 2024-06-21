class ObjectHelper {
  static isObjectEmpty(object: object): boolean {
    return Object.keys(object).length === 0;
  }
}

export default ObjectHelper;
