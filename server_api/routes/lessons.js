var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var only = require('only');
var Lesson = mongoose.model('Lesson');
var Media = mongoose.model('Media');
var User = mongoose.model("User");
var Comment = mongoose.model("Comment");

var onlyAdminVisiting = (req, res, next) => {
    if (!req.user.isAdmin) {
        res.sendStatus(403)
    }
}

router.get('/', (req, res, next) => {
    onlyAdminVisiting(req, res, next)
    Lesson.list().then(lessons => {
        res.send(lessons)
    }).catch(next);
});

router.post('/', async (req, res, next) => {
    onlyAdminVisiting(req, res, next)
    var fields = only(req.body, 'title content mediaId mediaId2');
    if(fields.mediaId) {
        let media = await Media.findById(fields.mediaId).exec()
        fields.mediaPath = media.path;    
    } 
    if(fields.mediaId2) {
        let media2 = await Media.findById(fields.mediaId2).exec()
        fields.mediaPath2 = media2.path        
    }
    let lesson = new Lesson(fields);
    lesson.save().then((doc) => res.send(doc));
});

router.put('/:id', async (req, res, next) => {
    onlyAdminVisiting(req, res, next)
    var fields = only(req.body, 'title content mediaId mediaId2');
    fields.updated = Date.now();
    if(fields.mediaId) {
        let media = await Media.findById(fields.mediaId).exec()
        fields.mediaPath = media.path;    
    } 
    if(fields.mediaId2) {
        let media2 = await Media.findById(fields.mediaId2).exec()
        fields.mediaPath2 = media2.path        
    }
    Lesson.update({_id: req.params.id}, fields).then(() => {
        Lesson.findById(req.params.id).then(doc => res.send(doc))
    }).catch(next)   
});

router.delete('/:id', (req, res, next) => {
   onlyAdminVisiting(req, res, next)
    Lesson.findByIdAndRemove(req.params.id).then(() => res.sendStatus(200)).catch(next);
});

router.get('/:id', (req, res, next) => {
    Lesson.findById(req.params.id).then(doc => {
        res.send(doc);
    }).catch(next);
});

router.get('/:id/comments/', (req, res, next) => {
    Comment.list(req.params.id).then((comments) => {
        res.send(comments);
    }).catch(next);
});

router.post('/:id/comments/', (req, res, next) => {
  let username = req.user.username;
  User.findOne({username: username}).then(user => {
    var fields = only(req.body, 'content');
    new Comment({
        content: fields.content,
        lessonId: req.params.id,
        username: user.username,
        userNickname: user.nickname,
        userAvatar: user.avatar
      }).save().then((comment) => {
        res.send(comment);
      });
  }).catch(next);
});

router.delete('/:id/comments/:commentId', (req, res, next) => {
    let lessonId = req.params.id, commentId = req.params.commentId;
    if(req.user.isAdmin) {
        Comment.remove({_id: commentId, lessonId: lessonId}).then(() => {
            res.send(200);
        }).catch(next)
    } else {   
        Comment.remove({_id: commentId, lessonId: lessonId, username: req.user.username}).then(() => {
            res.send(200)
        }).catch(next)
    }
})

module.exports = router;
