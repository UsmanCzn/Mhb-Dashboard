import { ApiV1 } from 'helper/api';

export default {
getTotalRevenueByBrand(filterType, startDate, endDate, brandIds) {
    const brandIdsQuery = brandIds.map(id => `brandIds=${id}`).join('&');

    return ApiV1.get(
        `services/app/Dashboard/GetTotalRevenueByBrand?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}&${brandIdsQuery}`
    );
},
// Response
// {
//   "result": [
//     {
//       "brandId": 2,
//       "brandName": "Mr. Holmes Bakehouse",
//       "brandLogo": "https://whitelabellingprod.blob.core.windows.net/brand-logo/13dd5f80-bef7-4400-a9db-2c7488cb6952.png",
//       "totalRevenue": 9832.65,
//       "totalOrders": 2556,
//       "averageOrderValue": 3.847,
//       "periodStart": "2026-01-10T00:00:00",
//       "periodEnd": "2026-02-10T00:00:00",
//       "period": "Daily"
//     },]
// }
getRevenueGrowth(comparisonType, currentPeriodEnd, brandIds) {
    const brandIdsQuery = brandIds.map(id => `brandIds=${id}`).join('&');

    return ApiV1.get(
        `services/app/Dashboard/GetRevenueGrowth?comparisonType=${comparisonType}&currentPeriodEnd=${currentPeriodEnd}&${brandIdsQuery}`
    );
},
// Response
// [
//   {
//     "brandId": 0,
//     "brandName": "string",
//     "currentRevenue": 0,
//     "previousRevenue": 0,
//     "growthAmount": 0,
//     "growthPercentage": 0,
//     "comparisonType": "string",
//     "currentPeriodStart": "2026-02-11T08:09:16.140Z",
//     "currentPeriodEnd": "2026-02-11T08:09:16.140Z",
//     "previousPeriodStart": "2026-02-11T08:09:16.140Z",
//     "previousPeriodEnd": "2026-02-11T08:09:16.140Z"
//   }
// ]
getBrandRevenueComparison(startDate, endDate, brandIds) {
    const brandIdsQuery = brandIds.map(id => `brandIds=${id}`).join('&');

    return ApiV1.get(
        `services/app/Dashboard/GetBrandRevenueComparison?startDate=${startDate}&endDate=${endDate}&${brandIdsQuery}`
    );
},
// Response
// {
//   "brands": [
//     {
//       "brandId": 0,
//       "brandName": "string",
//       "brandLogo": "string",
//       "revenue": 0,
//       "contributionPercentage": 0,
//       "totalOrders": 0,
//       "rank": 0
//     }
//   ],
//   "totalRevenue": 0,
//   "periodStart": "2026-02-11T08:09:16.162Z",
//   "periodEnd": "2026-02-11T08:09:16.162Z"
// }
getConversionRate({ brandId, branchId, startDate, endDate }) {
    return ApiV1.get(
        `services/app/Dashboard/GetConversionRate?brandId=${brandId}&branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`
    );
},
// Response
// [
//   {
//     "brandId": 0,
//     "brandName": "string",
//     "branchId": 0,
//     "branchName": "string",
//     "totalVisitors": 0,
//     "totalOrders": 0,
//     "paidOrders": 0,
//     "conversionRate": 0,
//     "customerConversionRate": 0
//   }
// ]
getReturningCustomersPercentage(startDate, endDate, brandIds) {
    const brandIdsQuery = brandIds.map(id => `brandIds=${id}`).join('&');

    return ApiV1.get(
        `services/app/Dashboard/GetReturningCustomersPercentage?startDate=${startDate}&endDate=${endDate}&${brandIdsQuery}`
    );
},
// Response
// [
//   {
//     "brandId": 0,
//     "brandName": "string",
//     "totalCustomers": 0,
//     "newCustomers": 0,
//     "returningCustomers": 0,
//     "returningPercentage": 0,
//     "newCustomerPercentage": 0,
//     "periodStart": "2026-02-11T08:09:16.180Z",
//     "periodEnd": "2026-02-11T08:09:16.180Z"
//   }
// ]
getTopPerformingBranches(brandId, startDate, endDate, topCount) {
    return ApiV1.get(
        `services/app/Dashboard/GetTopPerformingBranches?brandId=${brandId}&startDate=${startDate}&endDate=${endDate}&topCount=${topCount}`
    );
},
// Response
// [
//   {
//     "branchId": 0,
//     "branchName": "string",
//     "branchLogo": "string",
//     "address": "string",
//     "brandId": 0,
//     "brandName": "string",
//     "revenue": 0,
//     "totalOrders": 0,
//     "averageOrderValue": 0,
//     "conversionRate": 0,
//     "rank": 0,
//     "performanceLevel": "string"
//   }
// ]
getUnderperformingBranches(brandId, startDate, endDate, bottomCount) {
    return ApiV1.get(
        `services/app/Dashboard/GetUnderperformingBranches?brandId=${brandId}&startDate=${startDate}&endDate=${endDate}&bottomCount=${bottomCount}`
    );
},
// Response
// [
//   {
//     "branchId": 0,
//     "branchName": "string",
//     "branchLogo": "string",
//     "address": "string",
//     "brandId": 0,
//     "brandName": "string",
//     "revenue": 0,
//     "totalOrders": 0,
//     "averageOrderValue": 0,
//     "conversionRate": 0,
//     "rank": 0,
//     "performanceLevel": "string"
//   }
// ]
getBestPerformingProducts(brandId, startDate, endDate, topCount) {
    return ApiV1.get(
        `services/app/Dashboard/GetBestPerformingProducts?brandId=${brandId}&startDate=${startDate}&endDate=${endDate}&topCount=${topCount}`
    );
},
// Response
// [
//   {
//     "productId": 0,
//     "productName": "string",
//     "productImage": "string",
//     "brandId": 0,
//     "brandName": "string",
//     "revenue": 0,
//     "orderCount": 0,
//     "quantitySold": 0,
//     "averagePrice": 0,
//     "rank": 0,
//     "performanceLevel": "string"
//   }
// ]
getWorstPerformingProducts(brandId, startDate, endDate, bottomCount) {
    return ApiV1.get(
        `services/app/Dashboard/GetWorstPerformingProducts?brandId=${brandId}&startDate=${startDate}&endDate=${endDate}&bottomCount=${bottomCount}`
    );
}

// Response
// [
//   {
//     "productId": 0,
//     "productName": "string",
//     "productImage": "string",
//     "brandId": 0,
//     "brandName": "string",
//     "revenue": 0,
//     "orderCount": 0,
//     "quantitySold": 0,
//     "averagePrice": 0,
//     "rank": 0,
//     "performanceLevel": "string"
//   }
// ]




};
