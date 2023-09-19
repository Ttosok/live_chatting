# Live chatting project
  -	Fullstack website built in the third year of university.
  - compose of using:
  1. font:
      -	html, css, javascript, [ejs](https://ejs.co/).
  2. server:
      -	[mongoose.js](https://mongoosejs.com/), [socket.io](https://socket.io/) (library/add-on), [node.js](https://nodejs.org/en)
  3. data
      -	[mongodb](https://www.mongodb.com/).
  -	this project collected around 15 pages.
  -	The project still have quite some bugs with slow connecting problem of sending infomation
  - This website base on [facebook](https://www.facebook.com/) and [messager](https://www.messenger.com/).
## header
  **base** for user: [_header_chat.ejs](views/html/_header_chat.ejs)
   ![loaded](https://github.com/Ttosok/live_chatting/assets/109340804/c80975d0-4606-445e-a35a-1d94b0c79fe0)

  1. effect
   - click for setting list
    ![setting](https://github.com/Ttosok/live_chatting/assets/109340804/ab72ddd4-de62-408a-88b3-f1be85a00ef1)

  - click for friends asked
    ![adding friends](https://github.com/Ttosok/live_chatting/assets/109340804/ee8c3ebb-f4e0-4182-818a-f28babe37e04)
    
**base** for admin: [admin_index.ejs](views/html/admin_index.ejs)
  ![loaded](https://github.com/Ttosok/live_chatting/assets/109340804/199cdf4c-5153-48cd-b4c2-c759f5c207b5)

 1. effect
   - searching for name
   - click to different page
     
## body
  **base** for user:
  1. in [showing blog of other users : index.ejs](views/html/index.ejs):
    ![showing blog of other users : index.ejs](https://github.com/Ttosok/live_chatting/assets/109340804/7680be99-af78-4e89-bb89-6b96a0e651a2)

      1. effect:
         - hover
           - in the blog you can make comment
              ![hover in the user blog](https://github.com/Ttosok/live_chatting/assets/109340804/28df0242-afe2-42c8-a2e5-00aa4ea87956)

           - on the user blog posted you can like
               ![hover on the user blog](https://github.com/Ttosok/live_chatting/assets/109340804/d64b5d6a-881e-4d56-858c-bab22df8ebdb)
        - click/text
          - post your own blog with text and img
              ![post your own blog](https://github.com/Ttosok/live_chatting/assets/109340804/de69e54b-f465-4246-8f41-86d1a1edd87d)
          - post your own comment on other blog
              ![post your own comment](https://github.com/Ttosok/live_chatting/assets/109340804/1478138f-d887-4a43-a7d1-1d2d65427649)

  2. in [chat room : chat.ejs](views/html/chat.ejs):
    ![image](https://github.com/Ttosok/live_chatting/assets/109340804/2cc4c383-5296-4a58-a152-1836a5bfa548)
      - click/text
          - post your message
              ![post your message](https://github.com/Ttosok/live_chatting/assets/109340804/566364b1-d884-43e4-9656-d56b7757848a)

          - talk to different friends
              ![talk to different friends](https://github.com/Ttosok/live_chatting/assets/109340804/f3c31690-72a1-4c42-9587-502d61717cc2)
            
          - searching by friend name
        
              ![searching by friend name](https://github.com/Ttosok/live_chatting/assets/109340804/71fff814-ed71-4e58-af9d-ded9bd83b755)

  4. in [login : signin.ejs](views/html/signin.ejs):
    ![signin.ejs](https://github.com/Ttosok/live_chatting/assets/109340804/22642468-1084-4d3d-852d-4be2ef2cb33f)

  5. in [bug : __blackout.ejs](views/html/__blackout.ejs):

  ![__blackout.ejs](https://github.com/Ttosok/live_chatting/assets/109340804/96633bad-c718-4571-94cd-3e7d07b35616)

  6. in [basic profile of user : profile.ejs + fr_profile.ejs](views/html/profile.ejs):
      ![basic profile of user](https://github.com/Ttosok/live_chatting/assets/109340804/0ad80579-5dbe-4221-9778-a0f577bc78da)
      - click
          - selected make an note pop-up take note 
              ![note pop-up](https://github.com/Ttosok/live_chatting/assets/109340804/167ecc9d-aa1c-4136-938c-f129771944a1)
          - selected setting to change infomation about user
              ![setting about user](https://github.com/Ttosok/live_chatting/assets/109340804/7d4f5445-843b-403c-ae1b-fcef7c44b5f9)
          - selected blog or note to change the view from seeing only note to blog
             ![seeing only note to blog](https://github.com/Ttosok/live_chatting/assets/109340804/8e1cfa74-299e-4502-9fe3-224e59fa2f0e)
     - hover
       - on blog edit or note edit to either deleted or change the text
         ![note edit](https://github.com/Ttosok/live_chatting/assets/109340804/5fe783ff-cd5d-48ab-b7c2-ab3f78c0edad)
         
         ![blog edit](https://github.com/Ttosok/live_chatting/assets/109340804/634d35f1-57a9-40d7-a1d8-b2d13903b562)
      
 6. in [profile detail : fr_profile_detail.ejs + fr_profile.ejs](views/html/fr_profile_detail.ejs):
    ![improfile detailage](https://github.com/Ttosok/live_chatting/assets/109340804/659316e2-310c-4e85-947f-9977953a5958)
    - click
      - edit detail profile info
        ![edit detail profile](https://github.com/Ttosok/live_chatting/assets/109340804/81b6ae13-8e48-4087-9e96-e875b18563af)
      - if you don't have profile detail you can make one
        ![make profile detail](https://github.com/Ttosok/live_chatting/assets/109340804/03d83795-60fd-405e-ad22-f85280e468f8)

**base** for admin:
1. in [users account : admin_index.ejs](views/html/admin_index.ejs):
    ![admin index](https://github.com/Ttosok/live_chatting/assets/109340804/aeefd46e-1b28-4e33-b15a-9fc34f44d493)
  - click to change the user account as admin or deleted it
  - searching with user name
2. in [users blog : admin_blog.ejs](views/html/admin_blog.ejs):
    ![users blog](https://github.com/Ttosok/live_chatting/assets/109340804/cbc22f05-517a-4523-9ee8-3f46bfd9fe83)
 
  ## foot
  there is no footer for this project
