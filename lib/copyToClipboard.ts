/**
 * Utility function to copy text to clipboard with fallback for environments
 * where the Clipboard API is not available or blocked
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // First try the modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for environments where Clipboard API is not available
      return fallbackCopyTextToClipboard(text);
    }
  } catch (err) {
    console.error('Clipboard API failed, trying fallback: ', err);
    return fallbackCopyTextToClipboard(text);
  }
}

/**
 * Fallback method using the legacy execCommand approach
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea invisible but still functional
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    return false;
  }
}