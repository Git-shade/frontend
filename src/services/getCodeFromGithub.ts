
export async function fetchCodeFromGitHub(owner:string, repo:string, filePath: string): Promise<string> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();

    if (!responseData.content) {
      // console.log(`No content found in the response`);
      return `Oops, No Content Found on repo`;
    }
    
    // Decode the content from Base64 to UTF-8
    const decodedContent = atob(responseData.content);

    // Convert decoded content from binary string to UTF-8 string
    const utf8Content = decodeURIComponent(escape(decodedContent));

    return utf8Content;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
