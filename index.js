import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';



document.addEventListener("click", function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }

    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replybtn) {
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
})

function handleReplyBtnClick(tweetId) {
    // Target the specific input using the ID we just created
    const replyInput = document.getElementById(`reply-input-${tweetId}`)

    if (replyInput.value) {
        const targetTweetObj = tweetsData.filter(function (tweet) {
            return tweet.uuid === tweetId
        })[0]

        targetTweetObj.replies.unshift({
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value
        })

        render()
        // No need to set replyInput.value to '' here
        // because render() will wipe and recreate the DOM anyway
    }
}

// function handleReplyBtnClick(tweetId) {
//     let reply = document.getElementById('tweet-reply-input')
//     tweetsData.forEach(function (tweet) {
//         if (reply.value && tweet.uuid === tweetId) {
//             tweet.replies.unshift({
//                 handle: `@Scrimba ✅`,
//                 profilePic: `images/scrimbalogo.png`,
//                 tweetText: reply.value
//             })
//         }
//     })
//     render()
//     reply =''
// }

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]
    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0] // We used [0] cux we need an obj rather than the array
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    render()

}

function handleReplyClick(replyId) {

    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrim`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

    }
    render()
    tweetInput.value = ''
}

function getFeedHtml() {
    let FeedHtml = ''

    tweetsData.forEach(function (tweet) {
        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }
        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            for (let reply of tweet.replies) {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                    </div>
                </div>`
            }
        }
        FeedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src= ${tweet.profilePic} class="profile-pic">
                    <div>
                        <p class="handle"> ${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>
                    </div>
            </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    <div class="tweet-reply">
                        <img src="images/scrimbalogo.png" class="profile-pic-reply">
                        <div>
                            <textarea id="reply-input-${tweet.uuid}" placeholder="Reply...."></textarea>
                            <button id="reply-btn" data-replybtn="${tweet.uuid}"> Tweet </button>
                        </div>
                    </div>
                    ${repliesHtml}
                </div>
        </div>`
    })
    return FeedHtml
}
function render() {
    document.getElementById("feed").innerHTML = getFeedHtml()

}

render()
