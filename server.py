import http.server
import socketserver
import os
import webbrowser

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers so local testing is easier if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    # Ensure we are serving from the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Serving at http://localhost:{PORT}")
            print("Press Ctrl+C to stop the server")
            
            # Open browser automatically
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or e.winerror == 10048: # Address already in use
            print(f"Port {PORT} is already in use. Please try a different port.")
        else:
            raise
    except KeyboardInterrupt:
        print("\nServer stopped.")
