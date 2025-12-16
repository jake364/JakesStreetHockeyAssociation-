export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // In a real app, you would save this to a database
    // For now, we'll just acknowledge receipt
    
    let message = '';
    
    switch (type) {
      case 'game':
        message = `Game result uploaded: ${data.homeTeam} vs ${data.awayTeam}`;
        break;
      case 'stats':
        message = `Stats uploaded for ${data.playerName}`;
        break;
      case 'photo':
        message = `Photo uploaded successfully`;
        break;
      default:
        message = 'Upload received';
    }

    res.status(200).json({
      success: true,
      message,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
}
