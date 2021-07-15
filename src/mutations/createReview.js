import SimpleSchema from "simpl-schema";
import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import sanitizeHtml from "sanitize-html";

const inputSchema = new SimpleSchema({
  review: {
    type: Object,
    blackbox: true
  }
});

/**
 * @method createReview
 * @summary creates a review
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Input arguments for the operation
 * @param {String} [input.review] - review data
 * @return {String} created postId
 */
export default async function createReview(context, input) {
  inputSchema.validate(input);

  const { collections, /* simpleSchemas */ accountId = null } = context;
  // const { Review } = simpleSchemas;
  const { Catalog, Accounts } = collections;
  const { review: reviewInput } = input;

  if (accountId === null) {
    throw new ReactionError("invalid-param", "User has no account to create a review.");
  }

  const decodeCatalogItemOpaqueId = decodeOpaqueIdForNamespace("reaction/catalogProduct");
  const catalogItemId = decodeCatalogItemOpaqueId(reviewInput.catalogItemId);

  const product = await Catalog.findOne({
    "product._id": catalogItemId,
    "product.isVisible": true,
    "product.isDeleted": { $ne: true }
  });

  if (!product) {
    throw new ReactionError("not-found", "Product not found");
  }
  // TODO: make sure product has only 1 review per accountId
  // AND : throw new ReactionError("invalid-param", "Only one review per user on a product is possible.");

  // get user name or email
  const account = await Accounts.findOne({
    _id: accountId
  });
  const name = account.name || account.emails[0].address;

  const createdAt = new Date();
  const comment = sanitizeHtml(reviewInput.comment, {
    allowedTags: [],
    allowedAttributes: {}
  });

  const review = {
    _id: Random.id(),
    score: reviewInput.score,
    createdAt,
    accountId,
    name,
    comment,
    visible: false
  };

  // TODO: Add simpleSchema for review and validate before insertion
  // Review.validate(review);

  await Catalog.updateOne({ _id: product._id }, {
    $push: {
      "product.reviews": review
    }
  });

  return review;
}
