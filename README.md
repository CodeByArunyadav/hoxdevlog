# hoxdevlog
hoxdevlog Trending IT blogs like TechCrunch, Ars Technica, ZDNet, Wired, and VentureBeat provide expert insights on startups, AI, cybersecurity, cloud computing, and emerging tech innovations tools.
Certainly! Below is a comprehensive documentation of the entire system, organized from the beginning, including all the features you've discussed and the relevant code.

---

# **Authentication System Documentation**

## **1. Overview**

This document explains the functionality and structure of the authentication system, covering the **Login** and **Registration** processes. It includes details about the associated JavaScript code that handles user interactions, API communication, and error handling for both **login** and **registration** pages.

### **Features:**

* User login via email and password.
* User registration with name, email, and password.
* Front-end form handling for both login and registration pages.
* Interaction with the back-end via API calls.

---

## **2. File Overview**

### **Files Involved:**

1. **Login Page (`login-page`)**
2. **Register Page (`register-page`)**
3. **Common API Helper Function**
4. **Global Event Handlers for Edit/Delete and Form Submission**

Each section of the JavaScript functionality is explained in this documentation, along with how it interacts with the HTML and backend APIs.

---

## **3. Common API Helper**

### **Purpose**:

The `api()` function is a central helper used across the entire system to send HTTP requests to the server. It allows sending both `POST` and `GET` requests in a uniform manner.

### **Code:**

```javascript
async function api(url, data = null) {
  const options = {
    credentials: 'include' // Include cookies for session management
  };

  if (data) {
    options.method = 'POST';
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
```

### **Breakdown:**

1. **URL**: The endpoint to which the request is made (e.g., `api/login.php`).
2. **Data**: If provided, sends the data as a `POST` request. The data is sent as a JSON string.
3. **Request Options**:

   * `credentials: 'include'`: Ensures that cookies (e.g., session data) are included with the request.
   * `POST` method is used when data is passed, with the data formatted as JSON.
4. **Error Handling**: If the response is not `ok`, it throws an error.
5. **Response Handling**: The response is parsed as JSON and returned.

---

## **4. Login Page (`login-page`)**

### **Overview**:

The login page allows users to authenticate by providing their **email** and **password**. Upon successful login, users are redirected to the **home page** (`index.html`). If login fails, an error message is displayed.

### **Code:**

```javascript
if (pageId === 'login-page') {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const res = await api('api/login.php', {
      email: form.email.value,
      password: form.password.value
    });

    if (res.success) {
      location.href = 'index.html';
    } else {
      alert(res.message);
    }
  });
}
```

### **Breakdown:**

1. **Page Check (`pageId === 'login-page'`)**: Ensures this code runs only on the login page.
2. **Form Submission Event**: Prevents the form from submitting in the default way (`e.preventDefault()`), and instead handles it with custom JavaScript.
3. **API Request**: Sends a `POST` request to `api/login.php` with **email** and **password** as the request body.
4. **Success Handling**: If login is successful (`res.success`), the user is redirected to the **home page** (`index.html`).
5. **Failure Handling**: If login fails, an error message (`res.message`) is displayed using `alert()`.

---

## **5. Register Page (`register-page`)**

### **Overview**:

The register page allows users to create an account by providing their **name**, **email**, and **password**. Upon successful registration, the user is redirected to the **login page** (`login.html`). If registration fails, an error message is displayed.

### **Code:**

```javascript
if (pageId === 'register-page') {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const res = await api('api/register.php', {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value
    });

    if (res.success) {
      alert('Registration successful');
      location.href = 'login.html';
    } else {
      alert(res.message);
    }
  });
}
```

### **Breakdown:**

1. **Page Check (`pageId === 'register-page'`)**: Ensures this code runs only on the registration page.
2. **Form Submission Event**: Prevents the form from submitting in the default way (`e.preventDefault()`), and instead handles it with custom JavaScript.
3. **API Request**: Sends a `POST` request to `api/register.php` with **name**, **email**, and **password** as the request body.
4. **Success Handling**: If registration is successful (`res.success`), a success message is displayed and the user is redirected to the **login page** (`login.html`).
5. **Failure Handling**: If registration fails, an error message (`res.message`) is displayed using `alert()`.

---

## **6. Global Edit/Delete Handler**

### **Overview**:

The **global edit/delete handler** listens for **click events** on buttons for editing or deleting posts across various pages. It handles both the **edit** and **delete** actions for posts on the site.

### **Code:**

```javascript
document.addEventListener('click', async e => {
  if (e.target.classList.contains('editPost')) {
    location.href = `create.html?id=${e.target.dataset.id}`;
  }

  if (e.target.classList.contains('deletePost')) {
    if (!confirm('Delete this post?')) return;

    const res = await api('api/deletePost.php', {
      id: e.target.dataset.id
    });

    if (res.success) {
      alert('Post deleted');
      location.href = 'index.html';
    } else {
      alert(res.message);
    }
  }
});
```

### **Breakdown:**

1. **Event Listener**: The script listens for **click events** on the document, allowing for global handling of **edit** and **delete** actions.
2. **Edit Action**: If the clicked element has the class `editPost`, it redirects the user to the **create/edit post page** (`create.html`), passing the post `id` as a query parameter (`id=${e.target.dataset.id}`).
3. **Delete Action**: If the clicked element has the class `deletePost`, it:

   * Confirms the deletion (`confirm('Delete this post?')`).
   * Sends a `POST` request to `api/deletePost.php` to delete the post.
   * On success, the user is alerted (`Post deleted`) and redirected to the **home page** (`index.html`).
   * If there is an error, an alert with the error message is displayed (`res.message`).

---

## **7. Create/Edit Post Page (`create-page`)**

### **Overview**:

This page is used for both **creating** new posts and **editing** existing ones. If a post ID is passed in the URL, the form is populated with the existing post data for editing.

### **Code:**

```javascript
if (pageId === 'create-page') {
  const form = document.getElementById('create-post-form');
  const postId = new URLSearchParams(location.search).get('id');
  const title = form.querySelector('[name=title]');
  const content = form.querySelector('[name=content]');
  const category = form.querySelector('[name=category]');
  const image = form.querySelector('[name=image]');
  const submitBtn = form.querySelector('button');

  // 🔁 EDIT MODE (PRE-FILL)
  if (postId) {
    api(`api/getPost.php?id=${postId}`).then(post => {
      title.value = post.title;
      content.value = post.content;
      category.value = post.category;
      image.required = false;
      submitBtn.textContent = 'Update Post';
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);
    if (postId) formData.append('id', postId);

    const url = postId
      ? 'api/updatePost.php'
      : 'api/createPost.php';

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await res.json();

    if (result.success) {
      alert(postId ? 'Post updated' : 'Post created');
      location.href = 'index.html';
    } else {
      alert(result.message);
    }
  });
}
```

### **Breakdown:**

1. **Page Check (`pageId === 'create-page'`)**: Ensures this code runs only on the **Create/Edit Post Page**.
2. **Edit Mode**: If the `postId` is found in the URL, the form fields are pre-filled with the existing

