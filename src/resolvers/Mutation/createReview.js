/**
 *
 * @method createReview
 * @summary call create review mutation
 * @param {Object} _ - unused
 * @param {Object} args - The input arguments
 * @param {Object} args.input - mutation input object
 * @param {String} [args.input.clientMutationId] - The mutation id
 * @param {String} [args.input.review] - review data
 * @param {Object} context - an object containing the per-request state
 * @return {Promise<Object>} createReview payload
 */
export default async function createReview(_, { input }, context) {
  const {
    clientMutationId = null,
    review: reviewInput
  } = input;

  const review = context.mutations.createReview(context, {
    review: reviewInput
  });

  return {
    clientMutationId,
    review
  };
}
