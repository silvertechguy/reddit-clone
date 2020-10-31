import { IconButton, Text, VStack } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import db from "../lib/firebase";

const VoteButtons = ({ post }) => {
  const [isVoting, setVoting] = useState(false);
  const [votedPosts, setVotedPosts] = useState([]);

  useEffect(() => {
    const votesFromLocalStorage =
      JSON.parse(localStorage.getItem("votes")) || [];

    setVotedPosts(votesFromLocalStorage);
  }, []);

  const handleDisablingOfVoting = (postId) => {
    const previousVotedPosts = votedPosts;
    setVotedPosts([...previousVotedPosts, postId]);

    localStorage.setItem(
      "votes",
      JSON.stringify([...previousVotedPosts, postId])
    );
  };

  const handleClick = async (type) => {
    setVoting(true);

    // Do calculation to save the vote.
    let upVotesCount = post.upVotesCount;
    let downVotesCount = post.downVotesCount;

    const date = new Date();

    if (type === "upvote") {
      upVotesCount = upVotesCount + 1;
    } else {
      downVotesCount = downVotesCount + 1;
    }

    await db.collection("posts").doc(post.id).set({
      title: post.title,
      upVotesCount,
      downVotesCount,
      createdAt: post.createdAt,
      updatedAt: date.toUTCString(),
    });

    // Disable the voting button once the voting is successful.
    handleDisablingOfVoting(post.id);

    setVoting(false);
  };

  const checkIfPostIsAlreadyVoted = () => votedPosts.includes(post.id);

  return (
    <>
      <VStack>
        <IconButton
          size="lg"
          colorScheme="purple"
          aria-label="Upvote"
          icon={<FiArrowUp />}
          onClick={() => handleClick("upvote")}
          isLoading={isVoting}
          isDisabled={checkIfPostIsAlreadyVoted()}
        />
        <Text bg="gray.100" rounded="md" w="100%" p={1}>
          {post.upVotesCount}
        </Text>
      </VStack>
      <VStack>
        <IconButton
          size="lg"
          colorScheme="yellow"
          aria-label="Downvote"
          icon={<FiArrowDown />}
          onClick={() => handleClick("downvote")}
          isLoading={isVoting}
          isDisabled={checkIfPostIsAlreadyVoted()}
        />
        <Text bg="gray.100" rounded="md" w="100%" p={1}>
          {post.downVotesCount}
        </Text>
      </VStack>
    </>
  );
};

export default VoteButtons;
