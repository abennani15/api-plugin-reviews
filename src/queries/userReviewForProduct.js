import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";

/**
 * @name userReviewForProduct
 * @method
 * @memberof GraphQL/Post
 * @summary Query the Catalog collection for a review by productId and accountId
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Request input
 * @returns {Promise<Object>} Review object Promise
 */
export default async function posts(context, input) {
  const { collections } = context;
  const { Catalog } = collections;
  const { accountId, productId } = input;

  const decodeCatalogItemOpaqueId = decodeOpaqueIdForNamespace("reaction/catalogProduct");
  const catalogItemId = decodeCatalogItemOpaqueId(productId);

  const decodeAccountOpaqueId = decodeOpaqueIdForNamespace("reaction/account");
  const decodedAccountId = decodeAccountOpaqueId(accountId);

  const cursor = Catalog.aggregate([
    { $match: { "product._id": catalogItemId } },
    { $unwind: "$product.reviews" },
    { $match: { "product.reviews.accountId": decodedAccountId } },
    { $project: { createdAt: 0, updatedAt: 0 } }
  ]);

  const results = await cursor.toArray();

  if (results[0]) {
    return results[0].product.reviews;
  }
  return null;
}
