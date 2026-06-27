import re
import sys

def main():
    file_path = "Manual_Identitat_Extens.html"
    with open(file_path, "r") as f:
        content = f.read()

    # Remove dual anchors
    content = content.replace('<a href="#page-12" style="text-decoration:none; color:inherit; display:flex; pointer-events: auto;">\n        <a href="#page-12" style="text-decoration:none; color:inherit; display:flex; pointer-events: auto;">', '<a href="#page-12" style="text-decoration:none; color:inherit; display:flex; pointer-events: auto;">')
    
    # Fix the closing of the anchor at the end of the card
    # Find:
    #           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    #        </div>
    #     </div>
    #   </div>
    #   <!-- END CARD PROTOTYPE -->
    
    target = """           <div class="ux-mercat-btn-connect">
              CONNECTAR
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           </div>
        </div>
      </div>
      <!-- END CARD PROTOTYPE -->"""

    replacement = """           <div class="ux-mercat-btn-connect">
              CONNECTAR
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           </div>
        </div>
      </div>
      </a>
      <!-- END CARD PROTOTYPE -->"""

    if target in content and "</a>" not in target:
        content = content.replace(target, replacement)
    
    with open(file_path, "w") as f:
        f.write(content)

if __name__ == "__main__":
    main()
