import { Model, belongsTo } from 'ember-cli-mirage';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/db';

/*
  A model with a belongsTo association can be in six states
  with respect to its association. This helper class
  returns a child (and its association) in these various states.

  The return value is an array of the form

    [ child, parent ]

  where the parent may be undefined.
*/
export default class BelongsToHelper {

  constructor() {
    this.db = new Db();

    this.schema = new Schema(this.db, {
      post: Model.extend({
        // comments: hasMany()
      }),
      image: Model.extend({
        // comments: hasMany()
      }),
      comment: Model.extend({
        commentable: belongsTo('commentable', { polymorphic: true })
      })
    });
  }

  savedChildNoParent() {
    let insertedComment = this.db.comments.insert({ text: 'Lorem' });

    return [ this.schema.comments.find(insertedComment.id), undefined ];
  }

  savedChildNewParent() {
    let insertedComment = this.db.comments.insert({ text: 'Lorem' });
    let comment = this.schema.comments.find(insertedComment.id);
    let post = this.schema.posts.new({ title: 'Bob' });

    comment.commentable = post;

    return [ comment, post ];
  }

  savedChildSavedParent() {
    let insertedAuthor = this.db.posts.insert({ title: 'Bob' });
    let insertedComment = this.db.comments.insert({ text: 'Lorem', postId: insertedAuthor.id });
    let comment = this.schema.comments.find(insertedComment.id);
    let post = this.schema.posts.find(insertedAuthor.id);

    return [ comment, post ];
  }

  newChildNoParent() {
    return [ this.schema.comments.new({ text: 'Lorem' }), undefined ];
  }

  newChildNewParent() {
    let comment = this.schema.comments.new({ text: 'Lorem' });
    let newAuthor = this.schema.posts.new({ title: 'Bob' });
    comment.commentable = newAuthor;

    return [ comment, newAuthor ];
  }

  newChildSavedParent() {
    let insertedAuthor = this.db.posts.insert({ title: 'Bob' });
    let comment = this.schema.comments.new({ text: 'Lorem' });
    let savedAuthor = this.schema.posts.find(insertedAuthor.id);

    comment.commentable = savedAuthor;

    return [ comment, savedAuthor ];
  }

  // Just a saved unassociated parent.
  savedParent() {
    let insertedAuthor = this.db.posts.insert({ title: 'Bob' });

    return this.schema.posts.find(insertedAuthor.id);
  }

  newParent() {
    return this.schema.posts.new({ title: 'Bob' });
  }

}

export const states = [
  'savedChildNoParent',
  'savedChildNewParent'
  // 'savedChildSavedParent',
  // 'newChildNoParent',
  // 'newChildNewParent',
  // 'newChildSavedParent'
];
