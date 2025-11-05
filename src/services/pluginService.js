// services/pluginService.js
import { ApiV1 } from "helper/api";

const withResult = (resp) => {
  if (!resp) return resp;
  return resp?.data?.result ?? resp?.result ?? resp?.data ?? resp;
};

const pluginService = {
  getPluginsByBrandId(brandId) {
    return ApiV1.get(`services/app/BrandPlugin/GetPlugins?BrandId=${brandId}`).then(withResult);
  },
  createPlugin(payload) {
    return ApiV1.post(`services/app/BrandPlugin/CreatePlugin`, payload).then(withResult);
  },
  updatePlugin(payload) {
    return ApiV1.put(`services/app/BrandPlugin/UpdatePlugin`, payload).then(withResult);
  },
  getPluginOrders(brandId) {
    return ApiV1.get(`services/app/BrandPlugin/GetPluginOrders?BrandId=${brandId}`).then(withResult);
  },
  checkoutForBrandPlugin(pluginId, paymentSystemId) {
    return ApiV1.post(
      `services/app/BrandPlugin/CheckoutForBrandPlugin?brandPluginId=${pluginId}&PaymentSystemId=${paymentSystemId}`
    ).then(withResult);
  },
};

export default pluginService;
