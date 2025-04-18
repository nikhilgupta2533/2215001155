import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { getUsers, getUserPosts, getPostComments } from '../services/api';

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  height: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    averagePostsPerUser: 0,
    averageCommentsPerPost: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users
        const users = await getUsers();
        const totalUsers = users.length;

        // Fetch posts for each user
        const allUsersPosts = await Promise.all(
          users.map(user => getUserPosts(user.id))
        );
        const posts = allUsersPosts.flat();
        const totalPosts = posts.length;

        // Fetch comments for each post
        const allPostsComments = await Promise.all(
          posts.map(post => getPostComments(post.id))
        );
        const comments = allPostsComments.flat();
        const totalComments = comments.length;

        // Calculate averages
        const averagePostsPerUser = totalUsers ? (totalPosts / totalUsers).toFixed(2) : 0;
        const averageCommentsPerPost = totalPosts ? (totalComments / totalPosts).toFixed(2) : 0;

        setStats({
          totalUsers,
          totalPosts,
          totalComments,
          averagePostsPerUser,
          averageCommentsPerPost,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Root>
      <Title variant="h4">
        Platform Analytics
      </Title>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">
                Total Users
              </Typography>
              <StatValue variant="h4">
                {stats.totalUsers}
              </StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">
                Total Posts
              </Typography>
              <StatValue variant="h4">
                {stats.totalPosts}
              </StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">
                Total Comments
              </Typography>
              <StatValue variant="h4">
                {stats.totalComments}
              </StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">
                Average Posts per User
              </Typography>
              <StatValue variant="h4">
                {stats.averagePostsPerUser}
              </StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">
                Average Comments per Post
              </Typography>
              <StatValue variant="h4">
                {stats.averageCommentsPerPost}
              </StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Root>
  );
}

export default Analytics; 