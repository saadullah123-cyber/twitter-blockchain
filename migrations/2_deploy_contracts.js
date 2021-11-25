const TweetList = artifacts.require("./TweetList.sol");

module.exports = function(deployer) {
  deployer.deploy(TweetList);
};
