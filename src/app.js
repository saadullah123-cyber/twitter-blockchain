App = {
  loading: false,
  contracts: {},
  accounts: [],
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.renderTweets();
  },
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        accounts = await ethereum.request({ method: "eth_requestAccounts" });
        web3.eth.defaultAccount = accounts[0];
        // Acccounts now exposed
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
  loadAccount: async () => {
    // Set the current blockchain account
    App.account = accounts[0];
    // console.log(App.account)
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    // var contract = require("truffle-contract");
    // Create a JavaScript version of the smart contract
    const tweetList = await $.getJSON("TweetList.json");
    // console.log(tweetList)
    App.contracts.TweetList = TruffleContract(tweetList);
    App.contracts.TweetList.setProvider(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );

    App.tweetList = await App.contracts.TweetList.deployed();
  },
  //   render: async () => {
  //     // Prevent double render
  //     if (App.loading) {
  //       return;
  //     }
  //     // Update app loading state
  //     App.setLoading(true);

  //     // Render Account
  //     $("#account").html(App.account);

  //     // Render Tasks
  //     await App.renderTweets();

  //     // Update loading state
  //     App.setLoading(false);
  //   },
  createTweet: async () => {
    var message = document.getElementById("new-tweet").value;
    await App.tweetList.createTweet(message, { from: App.account });
    window.location.reload();
  },
  renderTweets: async () => {
    try {
      // Load the total task count from the blockchain
      const tweetCount = await App.tweetList.tweetCount();
      console.log(parseInt(tweetCount));
      // const temp = await App.tweetList.getTweet(1);
      // console.log(temp)
      //console.log(tweetCount);

      // Render out each task with a new task template
      // console.log(accounts[0])
      for (var i = 1; i <= tweetCount; i++) {
        // Fetch the task data from the blockchain
        const tweet = await App.tweetList.getTweet(i);
        console.log(tweet);
        // Create the html for the task
        if (tweet.length > 0) {
          const tweetTemplate = document.getElementById("tweetTemplate");
          const newTweetTemplate = tweetTemplate.cloneNode(true);
          newTweetTemplate.style.display = "flex";
          newTweetTemplate.children[1].children[0].children[1].innerHTML = tweet;
          document.getElementById("tweetList").appendChild(newTweetTemplate);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};
$(() => {
  $(window).load(() => {
    App.load();
  });
});
