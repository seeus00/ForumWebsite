import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { JsxElement } from 'typescript';

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
    const [replyPost, setReplyPost] = useState<PostObj>();

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

    const handleReplyButton = async (post: PostObj) => {
        const resp = await fetch('/auth/profile');
        if (resp.ok) {
            navigate("/reply", { state: post });
        }else {
            alert("You need to be logged in to post!");
        }
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
                    {/* <span>{post.id} | {post.dateCreated}</span> */}

                </div>
                <div className='postBody'>
                    <span>{post.content}</span>
                </div>
                <button className='replyButton' onClick={() => handleReplyButton(post)}>Reply</button>
            </div>)
    };

    const renderAllPosts = () => {
        if (!postData) return "";

        //Size to go up by
        const marginSpace = 40;

        let currMargin: number = 0;
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

        return currPostElements;
    }


    if (!postData) {
        return (<div><span>NO POSTS</span></div>)
    }else { 
        return (<div>
            {/* <div className='space'></div> */}
            <div className='posts'>
                {renderAllPosts()}
            </div>
            {/* Render original(first) poster*/}
            
        </div>)
    }

   
}