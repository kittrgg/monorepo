import colors from '@Colors';
import Head from '@Components/shared/Head';
import { Routes } from '@Utils/lookups/routes';
import { createStyles, Title } from '@mantine/core';
import Link from 'next/link';

function EmailChanged() {
  const { classes } = useStyles();

  return (
    <div className={classes.body}>
      <Head
        description={
          "You've started the process to change your email address. | kittr"
        }
        title="Email Change Started | kittr"
      />
      <div className={classes.errorBody}>
        <Title className={classes.errorHeader} order={1}>
          YOUR EMAIL HAS NOT CHANGED QUITE YET
        </Title>
        <p className={classes.errorParagraph}>
          Visit your new email address and click the link to confirm the change.
        </p>
        <p className={classes.errorParagraph}>
          If you change your mind about this new email address...
        </p>
        <p className={classes.errorParagraph}>
          Your previous email address still works.
        </p>
        <Link className={classes.errorLink} href={Routes.DASHBOARD} passHref>
          BACK TO LOGIN
        </Link>
      </div>
    </div>
  );
}

export default EmailChanged;

const useStyles = createStyles((theme) =>
  // Add reusable styles like headers, links, to MantineProvider theme
  ({
    body: {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.white,
      padding: theme.spacing.sm,
    },

    errorBody: {
      width: '100%',
      maxWidth: '800px',
      textAlign: 'center',
    },

    errorHeader: {
      marginBottom: '60px',
      fontSize: '28px',
      textAlign: 'left',
      letterSpacing: '3px',
      fontFamily: '"Barlow Condensed", serif',
    },

    errorParagraph: {
      fontSize: '18px',
      letterSpacing: '2px',
      textAlign: 'left',

      '&:first-of-type': {
        marginBottom: '32px',
      },
    },

    errorLink: {
      display: 'inline-block',
      margin: '0 auto',
      marginTop: '32px',
      padding: '20px 72px',
      borderRadius: '24px',
      backgroundColor: `${colors.white}`,
      color: `${colors.dark}`,
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: '0.2s',

      fontSize: '16px',
      fontWeight: 600,
      letterSpacing: '2px',
      fontDamily: '"Montserrat", sans-serif',

      '&:hover': {
        backgroundColor: `${colors.dark}`,
        color: `${colors.white}`,
      },
    },
  }),
);