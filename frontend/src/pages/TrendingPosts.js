// TrendingPosts.js
// Created by: Nikhil Gupta
// Date: April 18, 2025
// This component shows the most popular posts based on comment count
// For my Social Media Analytics project - GLA University

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getUsers, getUserPosts, getPostComments } from '../services/api';

// TODO: Maybe add filtering by date range later?
// TODO: Add pagination when I have time

// Styled components - learned these from MUI documentation
const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),  // Added some padding to make it look better
  backgroundColor: '#f5f5f5', // Light gray background - looks more modern
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s', // Cool hover effect
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: '#1a237e', // Dark blue - my university colors :)
  fontWeight: 'bold',
}));

const CommentCount = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.secondary.main,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const Author = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontStyle: 'italic',
}));

const LoadingContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

function TrendingPosts() {
  // State management using hooks (learned from React docs)
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // This function gets all the trending posts
    // Had to use async/await because of multiple API calls
    const fetchTrendingPosts = async () => {
      try {
        // First get all users - we need their names for the posts
        const usersData = await getUsers();
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);

        // Now get posts and comments for each user
        // This might be slow for lots of users, but works for now
        const allPosts = [];
        for (const user of usersData) {
          const userPosts = await getUserPosts(user.id);
          for (const post of userPosts) {
            const comments = await getPostComments(post.id);
            allPosts.push({
              ...post,
              author: user.name,
              commentCount: comments.length,
              comments: comments,
            });
          }
        }

        // Sort by most comments - these are trending!
        const sortedPosts = allPosts
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 10); // Just show top 10 for now

        setTrendingPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Oops! Something went wrong:', error);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []); // Empty dependency array - only run once when component mounts

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <Root>
      <Title variant="h4">
        🔥 Trending Posts
      </Title>
      <Grid container spacing={2}>
        {trendingPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.content}
                </Typography>
                <Author variant="subtitle1">
                  ✍️ Posted by: {post.author}
                </Author>
                <CommentCount variant="body2">
                  💬 {post.commentCount} Comments
                </CommentCount>
                {post.comments.map((comment) => (
                  <Typography 
                    key={comment.id} 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ ml: 2, mt: 1 }} // Indent comments
                  >
                    {comment.content}
                  </Typography>
                ))}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}

export default TrendingPosts; 