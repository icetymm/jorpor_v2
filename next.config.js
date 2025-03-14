/** @type {import('next').NextConfig} */


const nextConfig = {
    
    };


module.exports = {

    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: "url-loader",
        },
      });
      return config;
    },
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
 
}
