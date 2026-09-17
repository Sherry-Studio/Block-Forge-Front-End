import { LinkingOptions } from '@react-navigation/native';

/** Deep link config: blockforge://game/<id> opens GameDetail, etc. */
export const linking: LinkingOptions<any> = {
  prefixes: ['blockforge://', 'https://blockforge.example.com'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              GameDetail: 'game/:gameId',
              DailyChallenge: 'daily',
            },
          },
          GamesTab: {
            screens: {
              GamesHub: 'games',
              Category: 'games/:category',
            },
          },
          RewardsTab: {
            screens: {
              RewardsCentre: 'rewards',
              Leaderboard: 'leaderboard',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Settings: 'settings',
            },
          },
        },
      },
    },
  },
};
