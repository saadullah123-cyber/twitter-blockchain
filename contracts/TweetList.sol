pragma solidity >0.5.0;

contract TweetList {
    uint256 public tweetCount = 0;

    struct Tweet {
        uint256 id;
        string content;
    }
    mapping(uint256 => Tweet) public tweets;

    event TweetCreated(uint256 id, string content);

    constructor() public {
        createTweet("Twitter");
    }

    function createTweet(string memory _content) public {
        tweetCount++;
        tweets[tweetCount] = Tweet(tweetCount, _content);
        emit TweetCreated(tweetCount, _content);
    }

    function getTweet(uint id) public view returns(string memory content) {
        return tweets[id].content;
    }
}
