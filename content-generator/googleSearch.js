async function searchOnGoogle(title) {
  console.log("🔍 Using fallback links for:", title);

  return [
    "https://www.ibm.com/topics/chatbots",
    "https://www.zendesk.com/blog/what-is-a-chatbot/"
  ];
}

module.exports = searchOnGoogle;
