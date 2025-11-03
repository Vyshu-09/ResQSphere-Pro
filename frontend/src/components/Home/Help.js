import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Button,
  Paper
} from '@mui/material';
import {
  ExpandMore,
  Help as HelpIcon,
  Email,
  Phone,
  Chat,
  Article,
  VideoLibrary,
  School
} from '@mui/icons-material';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I report an emergency?',
      answer: 'Click on "Report Incident" from your dashboard, fill in the details including location, type of emergency, and priority level. You can also attach photos or videos to provide more context.'
    },
    {
      question: 'How do I update my profile?',
      answer: 'Go to your dashboard and click on "Edit Profile" to update your personal information, contact details, and preferences.'
    },
    {
      question: 'What are the different user roles?',
      answer: 'Admin: Full system access and management. Emergency Responder: Can manage incidents and coordinate responses. Civilian: Can report incidents and view alerts. Viewer: Read-only access to public information.'
    },
    {
      question: 'How do I view incidents on the map?',
      answer: 'Navigate to the "Maps" section from your dashboard. The map shows all active incidents with color-coded markers based on priority level.'
    },
    {
      question: 'Can I track my reported incidents?',
      answer: 'Yes! Go to "My Reports" section to see all incidents you have reported along with their current status and updates.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact support via email at support@resqsphere.com or use the contact form below. Emergency support is available 24/7.'
    }
  ];

  const resources = [
    {
      icon: <Article sx={{ fontSize: 40 }} />,
      title: 'Documentation',
      description: 'Comprehensive guides and API documentation'
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 40 }} />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features'
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Training Courses',
      description: 'Learn how to effectively use the platform'
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: 'Community Forum',
      description: 'Connect with other users and get help'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <HelpIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Help Center
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Find answers to your questions and get the support you need
            </Typography>
            <TextField
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 600,
                width: '100%',
                background: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Container>
        </Box>

        {/* FAQ Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqs
              .filter(faq => 
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" fontWeight="600">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="textSecondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>
        </Container>

        {/* Resources Section */}
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              Resources
            </Typography>
            <Grid container spacing={4}>
              {resources.map((resource, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: '#667eea', mb: 2 }}>
                        {resource.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {resource.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {resource.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Contact Section */}
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              Still Need Help?
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ mb: 4 }}>
              Contact our support team for immediate assistance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Email sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h6" fontWeight="600">Email</Typography>
                  <Typography variant="body2" color="textSecondary">
                    support@resqsphere.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Phone sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h6" fontWeight="600">Phone</Typography>
                  <Typography variant="body2" color="textSecondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chat sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h6" fontWeight="600">Live Chat</Typography>
                  <Typography variant="body2" color="textSecondary">
                    24/7 Available
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Help;

