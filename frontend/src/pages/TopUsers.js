import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { getUsers, getUserPosts, getPostComments } from '../services/api';

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const UserInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const Stats = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        // Fetch all users
        const users = await getUsers();
        
        // Fetch posts and comments for each user
        const usersWithStats = await Promise.all(
          users.map(async (user) => {
            const posts = await getUserPosts(user.id);
            
            // Get comments for each post
            const commentsPromises = posts.map(post => getPostComments(post.id));
            const commentsResults = await Promise.all(commentsPromises);
            
            const totalComments = commentsResults.reduce(
              (sum, comments) => sum + comments.length,
              0
            );

            return {
              ...user,
              totalPosts: posts.length,
              totalComments,
              commentsPerPost: posts.length ? (totalComments / posts.length).toFixed(2) : 0,
            };
          })
        );

        // Sort users by total comments and get top 5
        const sortedUsers = usersWithStats
          .sort((a, b) => b.totalComments - a.totalComments)
          .slice(0, 5);

        setTopUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setLoading(false);
      }
    };

    fetchTopUsers();
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
        Top 5 Most Commented Users
      </Title>
      <Grid container spacing={2}>
        {topUsers.map((user) => (
          <Grid item xs={12} key={user.id}>
            <StyledCard>
              <CardContent>
                <UserInfo>
                  <StyledAvatar>
                    {user.name.charAt(0)}
                  </StyledAvatar>
                  <Typography variant="h6">
                    {user.name}
                  </Typography>
                </UserInfo>
                <Stats variant="body2">
                  Total Posts: {user.totalPosts}
                </Stats>
                <Stats variant="body2">
                  Total Comments: {user.totalComments}
                </Stats>
                <Stats variant="body2">
                  Average Comments per Post: {user.commentsPerPost}
                </Stats>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}

export default TopUsers; 