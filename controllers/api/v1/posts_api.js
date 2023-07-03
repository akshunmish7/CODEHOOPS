const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate({
        path: 'user',
        select: '-password'
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: '-password'
        }
    });

    return res.json(200, {
        message: "v1 List of posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the objects _id into string
        if(post.user == req.user.id){

            // here remove() method is not working but deleteOne() works
            post.deleteOne();
            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: "Post and associated comments deleted successfully!"
            }); 

        }else{
            // req.flash('err', 'You can not delete this post!');
            return res.json(401, {
                message: "you cannot delete this post!"
            });
        }
    }
    catch(err){ 
        console.log('****', err);
        return res.json(500, {
            message: "Internal server Error"
        });
    }
}