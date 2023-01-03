import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

import './post.css';

interface PostObj {
    id: string,
    parentId: string,
    username: string,
    content: string,
    dateCreated: string,
    threadId: string
}

interface Posts {
    postsCount: number,
    posts: Array<PostObj>
}

export default function Post() {
    const [postData, setPostData] = useState<Posts>();
    const [hiddenPosts, setHiddenPosts] = useState<boolean[]>();

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPosts = async () => {
            const resp = await fetch('/api/getPosts?thread_id=' + params.threadId);
            if (resp.ok) {
                const data = await resp.json();
                setPostData(data);
            }
        };

        getPosts();
    }, []);

    useEffect(() => {
        if (hiddenPosts || !postData) return; 
        let temp: boolean[] = Array<boolean>(postData?.posts.length);
        temp.fill(false);

        setHiddenPosts(temp)
    }, [postData]);

    const handleReplyButton = async (post: PostObj) => {
        const resp = await fetch('/auth/profile');
        if (resp.ok) {
            navigate("/reply", { state: post });
        }else {
            alert("You need to be logged in to post!");
        }
    }

    //Hiding posts is represented by an array of bools that is the same size as the postsData.posts array.
    //The first comment that is hidden will set hiddenPosts[currPostInd] as true.
    //That first comment will determine which post "tree" is hidden (posts can be inside of another post, and another post, etc)
    const handlePostHide = (post: PostObj) => {
        if (!postData?.posts || !hiddenPosts) return;

        const posts: Element[] = Array.from(document.getElementsByClassName("post"));
        let currPostInd: number = posts.indexOf(posts.filter(postObj => postObj.id === post.id)[0]);
        
        const firstInd: number = currPostInd;
        const targetMargin: number = parseInt((posts[currPostInd] as HTMLElement).style.marginLeft);

        currPostInd++;
        while (currPostInd < posts.length) {
            let style = window.getComputedStyle(posts[currPostInd]);
            let top: number = parseInt(style.getPropertyValue('margin-left'));

            if (top < targetMargin || top === targetMargin) break;
            
            if (hiddenPosts[currPostInd]) {
                //Hide the post body if hidden inside of another post.
                if (posts[currPostInd].classList.contains("hiddenPost")) {
                    posts[currPostInd].classList.remove("hiddenPost");
                }else {
                    posts[currPostInd].classList.add("hiddenPost");
                }
               

                let style = window.getComputedStyle(posts[currPostInd]);
                let currTarget: number = parseInt(style.getPropertyValue('margin-left'));

                
                //If a post is already hidden (hiding a post inside of a post), skip the hidden posts until you reach the of the post "tree".
                currPostInd++
                while (currPostInd < posts.length) {
                    let style = window.getComputedStyle(posts[currPostInd]);
                    let currTop: number = parseInt(style.getPropertyValue('margin-left'));

                    if (currTop < currTarget || currTop === currTarget) break;
                    currPostInd++;
                }

                continue;
            }

            const newType: HTMLElement = posts[currPostInd] as HTMLElement;
            if (!hiddenPosts[firstInd]) {
                newType.classList.add("hiddenPost");
            }else {
                newType.classList.remove("hiddenPost");
            }
           
            posts[currPostInd].getElementsByClassName("hideButton")[0].innerHTML = (hiddenPosts[firstInd]) ? "Hide" : `Show - ${(currPostInd - 1) - firstInd} replies`;
            currPostInd++;
        }

        const postBody: HTMLElement = posts[firstInd].getElementsByClassName("postBody")[0] as HTMLElement;
        if (hiddenPosts[firstInd]) {
            postBody.classList.remove("hiddenPost");
        }else {
            postBody.classList.add("hiddenPost");
        }


        posts[firstInd].getElementsByClassName("hideButton")[0].innerHTML = (hiddenPosts[firstInd]) ? "Hide" : `Show - ${(currPostInd - 1) - firstInd} replies`;
        hiddenPosts[firstInd] = !hiddenPosts[firstInd];
    }

    const renderSinglePost = (post: PostObj) => {
        return (
            <div className='firstSinglePost' key={post.id} id={post.id}>
                <div className='firstPostUsername'>
                    <span>{post.username} | {post.dateCreated}</span>
                </div>
                <div className='firstPostBody'>
                    <span>{post.content}</span>
                    <div>
                        <button className='replyButton' onClick={() => handleReplyButton(post)}>Reply</button>
                    </div>
                </div>
            </div>)
    }

    const renderPost = (post: PostObj, marginSpace: number) => {
        const css = `
            #${post.id} {
                margin-left: ${marginSpace}px;
            }
        `

        return (
            <div className='post' style={{ marginLeft: marginSpace }} key={post.id} id={post.id}>
                <div className='postUsername'>
                    <span>{post.username} | {post.dateCreated}</span>
                    <button onClick={() => { handlePostHide(post) }} className='hideButton'>Hide</button>
                    {/* <span>{post.id} | {post.dateCreated}</span> */}

                </div>
                <div className='postBody'>
                    <span>{post.content}</span>
                    <div>
                        <button className='replyButton' onClick={() => handleReplyButton(post)}>Reply</button>
                    </div>
                </div>
            </div>)
    };

    const renderAllPosts = () => {
        if (!postData || postData.posts.length == 1) return "";


        //Size to go up by
        const marginSpace = 70;

        let currMargin: number = -marginSpace;
        let currPostElements = [];
        let currPosts: PostObj[] = postData.posts.slice(1);

        let visited: PostObj[] = [];

        let stack = [postData.posts[0]];

        while (stack.length > 0) {
            const topPost = stack[stack.length - 1];
            if (visited.includes(topPost)) {
                currMargin -= marginSpace;
                stack.pop();
                continue;
            }

            let children = currPosts.filter(currPost => currPost.parentId === topPost.id);

            if (children.length === 0) {
                currPostElements.push(renderPost(topPost, currMargin));
                stack.pop();
                
                visited.push(topPost);
                continue;
            }

            for (let i = children.length - 1; i >= 0; i--) {
                stack.push(children[i]);
            }


            currPostElements.push(renderPost(topPost, currMargin));
            currMargin += marginSpace;
            visited.push(topPost);
        }

        currPostElements = currPostElements.slice(1);

        return currPostElements;
    }


    if (!postData) {
        return (<div><span>NO POSTS</span></div>)
    }else { 
        return (<div>
            <div className='posts'>
                <div className='firstPost'>
                    {renderSinglePost(postData.posts[0])}
                </div>

                <div className='space'></div>
                <div className='space'></div>
                <div className='space'></div>

                {renderAllPosts()}
            </div>
            {/* Render original(first) poster*/}
            
        </div>)
    }

   
}