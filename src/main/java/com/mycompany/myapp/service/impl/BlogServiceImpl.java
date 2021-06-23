package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Blog;
import com.mycompany.myapp.repository.BlogRepository;
import com.mycompany.myapp.service.BlogService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Blog}.
 */
@Service
@Transactional
public class BlogServiceImpl implements BlogService {

    private final Logger log = LoggerFactory.getLogger(BlogServiceImpl.class);

    private final BlogRepository blogRepository;

    public BlogServiceImpl(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Override
    public Blog save(Blog blog) {
        log.debug("Request to save Blog : {}", blog);
        return blogRepository.save(blog);
    }

    @Override
    public Optional<Blog> partialUpdate(Blog blog) {
        log.debug("Request to partially update Blog : {}", blog);

        return blogRepository
            .findById(blog.getId())
            .map(
                existingBlog -> {
                    if (blog.getName() != null) {
                        existingBlog.setName(blog.getName());
                    }
                    if (blog.getHandle() != null) {
                        existingBlog.setHandle(blog.getHandle());
                    }

                    return existingBlog;
                }
            )
            .map(blogRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Blog> findAll() {
        log.debug("Request to get all Blogs");
        return blogRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Blog> findOne(Long id) {
        log.debug("Request to get Blog : {}", id);
        return blogRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Blog : {}", id);
        blogRepository.deleteById(id);
    }
}
