import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { getUsers, getUserPosts } from '../services/api';

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = [];
        for (const userId of Object.keys(users)) {
          const userPosts = await getUserPosts(userId);
          allPosts.push(...userPosts);
        }
        
        // Sort posts by ID (assuming newer posts have higher IDs)
        const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (Object.keys(users).length > 0) {
      fetchPosts();
    }
  }, [users]);

  return (
    <Root>
      <Title variant="h4">
        Latest Posts
      </Title>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {users[post.userId]?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body1">
                  {post.content}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}

export default Feed; 