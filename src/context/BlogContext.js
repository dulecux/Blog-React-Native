import createDataContext from "./createDataContext";
import jsonServer from '../api/jsonServer';



const blogReducer = (state, action) => {

  switch(action.type) {
      case 'delete_blogPost':
        return state.filter(blogPost => blogPost.id !== action.payload );  
      case 'edit_blogPost':
        return state.map((blogPost) => {
                    return blogPost.id === action.payload.id ? action.payload : blogPost;
        });
      case 'get_blogPosts':
        return action.payload;  
      default:
        return state;
  }

};

const getBlogPosts = (dispatch) => {

  return async () => {
    const response = await jsonServer.get('/blogposts');
    // response.data === [ {}, {}, {} ...]
    dispatch({ type: 'get_blogPosts', payload: response.data });
  };
};

const addBlogPost = () => {

  return async (title, content, callback) => {

    await jsonServer.post('/blogposts', { title, content });
  //  dispatch( {type: 'add_blogPost', payload: { title: title, content: content} } );
    if(callback) {
      callback();
    }   
  };
  
};

const deleteBlogPost = (dispatch) => {

    return async (id) => {
      await jsonServer.delete(`/blogposts/${id}`);
      dispatch({type: 'delete_blogPost', payload: id});
    };
};

const editBlogPost = (dispatch) => {

  return async (id, title, content, callback) => {
      await jsonServer.put(`/blogposts/${id}`, { title, content });

      dispatch({type: 'edit_blogPost', payload: { id, title, content } });

      if(callback) {
        callback();
      }   
  };
};

export const { Context, Provider} = createDataContext(blogReducer, { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts }, []);
