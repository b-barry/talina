import { isProductionEnvironment } from './utils'

export const fetchQuantityAvailable = async (skuId = '') => {
  if (!isProductionEnvironment()) {
    return 100
  }
  // perform real fetching
}
