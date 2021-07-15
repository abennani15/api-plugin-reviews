/**
 * @name Query/userReviewForProduct
 * @method
 * @memberof GraphQl/Query
 * @summary Query for a user review for a specific product
 * @param {Object} _ - unused
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Object} context - an object containing the per-request state
 * @param {Object} info Info about the GraphQL request
 * @returns {Promise<Object>} Posts
**/
export default async function userReviewForProduct(_, args, context, info) {
  const query = context.queries.userReviewForProduct(context, args);

  return query;
}
